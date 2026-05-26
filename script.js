// Q&A Database
const qaDatabase = [
    {
        question: "SA - Validation Error CMN.ATO.INCDTLS.000391",
        answer: "A value of zero must be entered at item 13S within the trust income schedule.",
        keywords: ["validation", "error", "CMN.ATO.INCDTLS.000391", "trust", "income", "schedule", "13S"]
    },
    {
        question: "How do I resolve authentication timeout errors?",
        answer: "Authentication timeout errors typically occur when the session expires. To resolve this, try clearing your browser cache, logging out and logging back in, or checking if your system time is synchronized correctly.",
        keywords: ["authentication", "timeout", "session", "login", "error"]
    },
    {
        question: "What should I do if I encounter a database connection error?",
        answer: "Database connection errors can be caused by network issues, incorrect credentials, or server downtime. First, verify your connection settings, ensure the database server is running, and check your firewall settings. If the issue persists, contact your system administrator.",
        keywords: ["database", "connection", "error", "network", "server"]
    },
    {
        question: "How can I fix installation errors during software setup?",
        answer: "Installation errors may be due to insufficient permissions, conflicting software, or corrupted installation files. Run the installer as administrator, temporarily disable antivirus software, and ensure you have enough disk space. If the problem continues, download a fresh copy of the installer.",
        keywords: ["installation", "setup", "error", "permissions", "administrator"]
    },
    {
        question: "Why am I getting a 'file not found' error?",
        answer: "A 'file not found' error indicates that the system cannot locate the required file. Check if the file path is correct, ensure the file hasn't been moved or deleted, and verify that you have the necessary permissions to access the file location.",
        keywords: ["file", "not found", "error", "path", "permissions"]
    },
    {
        question: "How do I troubleshoot slow software performance?",
        answer: "Slow performance can result from insufficient system resources, background processes, or corrupted cache. Try closing unnecessary applications, clearing application cache, updating to the latest software version, and ensuring your system meets the minimum requirements.",
        keywords: ["performance", "slow", "lag", "speed", "optimization"]
    },
    {
        question: "What does Error Code 500 mean?",
        answer: "Error Code 500 is an Internal Server Error, indicating that something went wrong on the server side. This is typically not a client-side issue. Wait a few minutes and try again, or contact technical support if the error persists.",
        keywords: ["error", "500", "server", "internal", "code"]
    },
    {
        question: "How can I recover a lost password?",
        answer: "To recover a lost password, use the 'Forgot Password' link on the login page. You'll receive a password reset link via email. If you don't have access to your registered email, contact customer support with proper identification to verify your account.",
        keywords: ["password", "recovery", "reset", "forgot", "login"]
    }
];

// Function to populate Q&A items
function populateQA(items = qaDatabase) {
    const container = document.getElementById('qaContainer');
    const noResults = document.getElementById('noResults');

    container.innerHTML = '';

    if (items.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    items.forEach(item => {
        const qaItem = document.createElement('div');
        qaItem.className = 'qa-item';

        const question = document.createElement('div');
        question.className = 'question';
        question.innerHTML = `Q: ${highlightErrorCode(item.question)}`;

        const answer = document.createElement('div');
        answer.className = 'answer';
        answer.textContent = `A: ${item.answer}`;

        qaItem.appendChild(question);
        qaItem.appendChild(answer);
        container.appendChild(qaItem);
    });
}

// Function to highlight error codes
function highlightErrorCode(text) {
    const errorCodePattern = /([A-Z]{2,}\.[A-Z]{2,}\.[A-Z]{2,}\.\d+)/g;
    return text.replace(errorCodePattern, '<span class="error-code">$1</span>');
}

// Function to filter questions based on search input
function filterQuestions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    if (searchTerm === '') {
        populateQA();
        return;
    }

    const filteredItems = qaDatabase.filter(item => {
        const questionMatch = item.question.toLowerCase().includes(searchTerm);
        const answerMatch = item.answer.toLowerCase().includes(searchTerm);
        const keywordMatch = item.keywords.some(keyword =>
            keyword.toLowerCase().includes(searchTerm)
        );

        return questionMatch || answerMatch || keywordMatch;
    });

    populateQA(filteredItems);
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    populateQA();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Allow Enter key to trigger search
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filterQuestions();
        }
    });
});
