document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
    });
});

async function postData(url, data) {
    const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return resp.json();
}

// Expense Form Handler
document.getElementById("expense-form").onsubmit = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    const resultEl = document.getElementById("expense-result");
    
    try {
        resultEl.classList.remove('result-error');
        resultEl.textContent = "Submitting...";
        const res = await postData("/add_expense", data);
        resultEl.textContent = JSON.stringify(res, null, 2);
        resultEl.classList.add('result-success');
        e.target.reset();
        e.target.querySelector('input[name="date"]').value = new Date().toISOString().split('T')[0];
    } catch (err) {
        resultEl.textContent = "Error: " + err.message;
        resultEl.classList.add('result-error');
    }
};

// Investment Form Handler
document.getElementById("investment-form").onsubmit = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    const resultEl = document.getElementById("investment-result");
    
    try {
        resultEl.classList.remove('result-error');
        resultEl.textContent = "Submitting...";
        const res = await postData("/add_investment", data);
        resultEl.textContent = JSON.stringify(res, null, 2);
        resultEl.classList.add('result-success');
        e.target.reset();
        e.target.querySelector('input[name="date"]').value = new Date().toISOString().split('T')[0];
    } catch (err) {
        resultEl.textContent = "Error: " + err.message;
        resultEl.classList.add('result-error');
    }
};

// Summary Loader
document.getElementById("load-summary").onclick = async () => {
    const summaryEl = document.getElementById("summary");
    const progressBar = document.getElementById("profit-progress");
    
    summaryEl.textContent = "Loading...";
    
    try {
        const resp = await fetch("/view_investment_summary");
        const json = await resp.json();
        
        if (json.summary && json.summary.length > 0) {
            const totalProfit = json.summary.reduce((sum, item) => sum + item.profit_loss, 0);
            const maxPossible = Math.max(Math.abs(totalProfit) * 2, 100);
            const progressPercentage = ((totalProfit + maxPossible) / (2 * maxPossible)) * 100;
            
            progressBar.style.width = `${progressPercentage}%`;
            progressBar.style.backgroundColor = totalProfit >= 0 ? '#4cc9f0' : '#f72585';
            
            const formattedSummary = json.summary.map(item => ({
                ...item,
                profit_loss: item.profit_loss.toFixed(2),
                tax_paid: item.tax_paid.toFixed(2)
            }));
            
            summaryEl.textContent = JSON.stringify({
                summary: formattedSummary,
                total_profit: totalProfit.toFixed(2)
            }, null, 2);
        } else {
            summaryEl.textContent = "No investment data available";
            progressBar.style.width = "50%";
            progressBar.style.backgroundColor = '#6c757d';
        }
    } catch (err) {
        summaryEl.textContent = "Error: " + err.message;
    }
};

async function clearData(table) {
    if (!confirm(`Are you sure you want to clear all ${table}? This cannot be undone.`)) return;
    
    const dumpEl = document.getElementById("dump");
    dumpEl.textContent = `Clearing ${table}...`;
    
    try {
        const resp = await fetch(`/clear_${table}`, { method: 'POST' });
        const result = await resp.json();
        dumpEl.textContent = JSON.stringify(result, null, 2);
        if (table === 'expenses') location.href = '/dump_expenses';
        else location.href = '/dump_investments';
    } catch (err) {
        dumpEl.textContent = "Error: " + err.message;
    }
}

window.onload = () => document.getElementById("load-summary").click();