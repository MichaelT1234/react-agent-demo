document.addEventListener('DOMContentLoaded', () => {
    // Initial Load: Check for Data
    loadData();

    // Auto-resize textarea
    const textarea = document.getElementById('user-input');
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Enter key to submit
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});

// Navigation
function switchTab(tabId) {
    // Nav Items
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Views
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(`${tabId}-view`).classList.add('active');
}

// Chat Logic
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Add User Message
    addMessage('user', message);

    // Add Loading State
    const loadingId = addLoadingIndicator();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        // Remove loading
        document.getElementById(loadingId).remove();

        if (data.error) {
            addMessage('bot', `Error: ${data.error}`);
            return;
        }

        // Render Answer with Steps
        addBotResponse(data.response, data.steps);

    } catch (err) {
        if (document.getElementById(loadingId)) {
            document.getElementById(loadingId).remove();
        }
        addMessage('bot', 'Network Error: Could not reach the agent.');
        console.error(err);
    }
}

function addMessage(type, text) {
    const history = document.getElementById('chat-history');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;

    msgDiv.appendChild(bubble);
    history.appendChild(msgDiv);
    scrollToBottom();
}

function addLoadingIndicator() {
    const history = document.getElementById('chat-history');
    const id = 'loading-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.id = id;
    msgDiv.className = 'message bot';
    msgDiv.innerHTML = `<div class="bubble" style="color:var(--text-secondary); font-style:italic;">Thinking... <i class="ph ph-spinner ph-spin"></i></div>`;
    history.appendChild(msgDiv);
    scrollToBottom();
    return id;
}

function addBotResponse(finalAnswer, steps) {
    const history = document.getElementById('chat-history');

    // 1. Thinking Process (if any)
    if (steps && steps.length > 0) {
        const thoughtsContainer = document.createElement('div');
        thoughtsContainer.className = 'thoughts-container';

        const uniqueId = 'thoughts-' + Date.now();

        // Toggle Button
        thoughtsContainer.innerHTML = `
            <button class="thoughts-toggle" onclick="toggleThoughts('${uniqueId}')">
                <i class="ph ph-brain"></i>
                View Reasoning Process (${steps.length} Steps)
                <i class="ph ph-caret-down"></i>
            </button>
            <div id="${uniqueId}" class="thoughts-content">
                ${steps.map((step, index) => `
                    <div class="step">
                        <div class="step-tool">Step ${index + 1}: ${step.log ? step.log.split('\n')[0] : 'Action'}</div>
                        <div class="step-log">${step.log || ''}</div>
                        <div class="step-obs">> ${step.observation || ''}</div>
                    </div>
                `).join('')}
            </div>
        `;

        history.appendChild(thoughtsContainer);
    }

    // 2. Final Answer
    addMessage('bot', finalAnswer);
}

function toggleThoughts(id) {
    const content = document.getElementById(id);
    content.classList.toggle('expanded');
    // Rotate icon logic could go here
}

function scrollToBottom() {
    const container = document.querySelector('.chat-container');
    container.scrollTop = container.scrollHeight;
}

// Data Logic
async function loadData() {
    const table = document.getElementById('data-table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const container = document.querySelector('.table-container');

    try {
        const response = await fetch('/api/data');
        const result = await response.json();

        if (result.error) {
            container.innerHTML = `<div style="padding: 2rem; color: #ef4444;">Error loading data: ${result.error}</div>`;
            return;
        }

        // Clear existing
        thead.innerHTML = '';
        tbody.innerHTML = '';

        if (!result.data || result.data.length === 0) {
            container.innerHTML = `<div style="padding: 2rem; color: var(--text-secondary);">No data found in CSV.</div>`;
            return;
        }

        // Headers
        const headerRow = document.createElement('tr');
        result.columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Rows
        result.data.forEach(row => {
            const tr = document.createElement('tr');
            result.columns.forEach(col => {
                const td = document.createElement('td');
                td.textContent = row[col];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Failed to load data", err);
        if (container) {
            container.innerHTML = `<div style="padding: 2rem; color: #ef4444;">Failed to load data (Client-side error). Check console for details. <br> ${err.message}</div>`;
        }
    }
}
