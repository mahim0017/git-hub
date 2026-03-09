let allIssues = [];

// Login Functionality
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        if (user === 'admin' && pass === 'admin123') {
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid Username or Password! Try admin / admin123');
        }
    });
}

// Fetch all issues
async function fetchIssues() {
    const loader = document.getElementById('loader');
    const container = document.getElementById('issueContainer');
    
    if (loader) loader.classList.remove('hidden');
    if (container) container.innerHTML = '';

    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        
        allIssues = data.data ? data.data : data; 
        displayIssues(allIssues);
    } catch (error) {
        console.error("Data fetch error:", error);
    } finally {
        if (loader) loader.classList.add('hidden');
    }
}

// Display issues on the dashboard
function displayIssues(issues) {
    const container = document.getElementById('issueContainer');
    const countDisplay = document.getElementById('issueCountDisplay'); 
    
    if (!container) return;
    container.innerHTML = '';

    if (countDisplay) {
        countDisplay.innerText = `${issues.length} Issues`;
    }

    if (issues.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-gray-400 py-10">No data found!</p>`;
        return;
    }

    issues.forEach(issue => {
        const currentId = issue._id || issue.id;
        
        let statusImg = issue.status.toLowerCase() === 'open' ? 'assets/Open-Status.png' : 'assets/Close-status.png';
        let borderColor = issue.status.toLowerCase() === 'open' ? 'border-t-green-500' : 'border-t-purple-600';
        
        let priorityColor = 'bg-gray-100 text-gray-600';
        if (issue.priority.toLowerCase() === 'high') priorityColor = 'bg-red-50 text-red-500';
        else if (issue.priority.toLowerCase() === 'medium') priorityColor = 'bg-yellow-50 text-yellow-600';
        else if (issue.priority.toLowerCase() === 'low') priorityColor = 'bg-gray-100 text-gray-500';

        const card = document.createElement('div');
        card.className = `bg-white rounded-lg shadow-sm border-t-4 ${borderColor} flex flex-col hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1 overflow-hidden`;
        
        card.onclick = () => showIssueDetails(currentId);

        card.innerHTML = `
            <div class="p-5">
                <div class="flex justify-between items-center mb-4">
                    <img src="${statusImg}" alt="${issue.status}" class="w-6 h-6">
                    <span class="px-3 py-1 text-[10px] uppercase font-bold rounded-full ${priorityColor}">${issue.priority}</span>
                </div>
                
                <h3 class="font-bold text-gray-800 text-md mb-2 line-clamp-1">${issue.title}</h3>
                <p class="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">${issue.description}</p>

                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-[10px] font-bold text-red-400 border border-red-100 uppercase">
                        <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span> BUG
                    </span>
                    <span class="flex items-center gap-1 px-2 py-1 rounded bg-yellow-50 text-[10px] font-bold text-yellow-500 border border-yellow-100 uppercase">
                        <span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> HELP WANTED
                    </span>
                </div>
            </div>
            
            <div class="border-t bg-gray-50/50 p-4 mt-auto">
                <div class="flex items-center justify-between">
                    <span class="text-[11px] font-medium text-gray-400">#1 by ${issue.author}</span>
                    <span class="text-[11px] text-gray-400">${new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Show details in Modal (FIXED for your screenshot design)
async function showIssueDetails(id) {
    const modal = document.getElementById('issueModal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = '<div class="text-center py-20 font-bold text-gray-600 animate-pulse">Loading detailed view...</div>';
    modal.classList.remove('hidden');

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const result = await res.json();
        const issue = result.data ? result.data : result;
        let statusBadgeColor = issue.status.toLowerCase() === 'open' ? 'bg-green-500 text-white' : 'bg-purple-600 text-white';
        let priorityBadgeColor = issue.priority.toLowerCase() === 'high' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white';

        modalBody.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-3xl font-extrabold text-gray-900 leading-tight">${issue.title}</h2>
                
                <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span class="${statusBadgeColor} px-4 py-1 rounded-full text-xs font-bold capitalize">${issue.status}ed</span>
                    <span class="text-gray-300">|</span>
                    <p>Opened by <span class="font-semibold text-gray-700">${issue.author}</span></p>
                    <span class="text-gray-300">•</span>
                    <p>${new Date(issue.createdAt).toLocaleDateString('en-GB')}</p>
                </div>

                <div class="flex gap-2">
                    <span class="flex items-center gap-1 px-3 py-1.5 rounded bg-red-50 text-[11px] font-bold text-red-500 border border-red-100 uppercase">
                        <img src="assets/Open-Status.png" class="w-3 h-3 opacity-70"> BUG
                    </span>
                    <span class="flex items-center gap-1 px-3 py-1.5 rounded bg-yellow-50 text-[11px] font-bold text-yellow-600 border border-yellow-100 uppercase">
                         HELP WANTED
                    </span>
                </div>

                <div class="py-4">
                    <p class="text-gray-600 text-lg leading-relaxed">
                        ${issue.description}
                    </p>
                </div>

                <div class="bg-gray-50 rounded-2xl p-6 flex flex-col md:flex-row gap-8">
                    <div class="flex-1">
                        <p class="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">Assignee:</p>
                        <p class="text-xl font-bold text-gray-800">${issue.author}</p>
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">Priority:</p>
                        <span class="${priorityBadgeColor} px-6 py-1.5 rounded-full text-xs font-extrabold uppercase shadow-sm">
                            ${issue.priority}
                        </span>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <button onclick="closeModal()" class="bg-[#6019f5] text-white px-10 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-purple-200">
                        Close
                    </button>
                </div>
            </div>
        `;
    } catch (err) {
        console.error("Modal Error:", err);
        modalBody.innerHTML = `
            <div class="text-center py-10">
                <p class="text-red-500 font-bold mb-4">Something went wrong while loading details.</p>
                <button onclick="closeModal()" class="bg-black text-white px-6 py-2 rounded-lg">Go Back</button>
            </div>
        `;
    }
}

function closeModal() {
    const modal = document.getElementById('issueModal');
    if (modal) modal.classList.add('hidden');
}

function filterIssues(status, element) {
    document.querySelectorAll('button').forEach(btn => btn.classList.remove('active-tab'));
    if(element) element.classList.add('active-tab');

    if (status === 'all') {
        displayIssues(allIssues);
    } else {
        const filtered = allIssues.filter(item => item.status.toLowerCase() === status.toLowerCase());
        displayIssues(filtered);
    }
}

async function handleSearch() {
    const query = document.getElementById('searchInput').value;
    if (!query) return fetchIssues();
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
        const result = await res.json();
        const searchResults = result.data ? result.data : result;
        displayIssues(searchResults);
    } catch (err) {
        console.error("Search error:", err);
    } finally {
        if (loader) loader.classList.add('hidden');
    }
}

window.onload = () => {
    if (window.location.pathname.includes('dashboard.html')) {
        fetchIssues();
    }
};