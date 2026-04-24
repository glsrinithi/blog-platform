// Blog Platform JavaScript
class BlogPlatform {
    constructor() {
       this.posts = JSON.parse(localStorage.getItem('blogPosts')) || this.getSamplePosts();
       this.currentEditId = null;
       this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || this.askUser();

       this.init();
   }

   askUser() {
       let name = prompt("Enter your username:");

       if (!name) {
           name = "Guest_" + Math.floor(Math.random() * 1000);
      }

       const user = {
           id: "user_" + Date.now(),
           name: name
     };

       localStorage.setItem("currentUser", JSON.stringify(user));
       return user;
   }

    parseMarkdown(content) {
       if (typeof marked !== "undefined") {
           return marked.parse(content);
        } else {
        // fallback if marked not loaded
           return content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>");
    }
}
    // 5 Colorful Sample Posts with UNIQUE USERNAMES
    getSamplePosts() {
        return [
            {
                id: '1',
                title: "🌟 The Magic of Reading Fantasy Books",
                content: `There's something truly magical about diving into a fantasy world! From the epic battles in Tolkien's Middle-earth to the intricate magic systems of Brandon Sanderson, fantasy books transport us to places we could only dream of. 

My current favorites:
- *The Name of the Wind* by Patrick Rothfuss – the storytelling is breathtaking!
- *Mistborn* series – innovative magic system
- *Stormlight Archive* – epic world-building

What are YOUR favorite fantasy books? Share in the comments! 📚✨`,
                category: 'books',
                author: 'SarahReadsMagic',
                date: '2024-01-15T10:30:00',
                likes: 12,
                liked: false
            },
            {
                id: '2',
                title: "☕ My Perfect Morning Routine for a Colorful Day",
                content: `Good morning sunshine! 🌈 Here's how I start my day with joy and energy:

1. **6:30 AM** - Wake up with gratitude journaling (5 mins)
2. **6:45 AM** - Rainbow smoothie bowl 🥣 (mango, berries, spinach, banana)
3. **7:15 AM** - 20 min yoga flow with colorful leggings 💜🧡
4. **7:45 AM** - Read 10 pages of my current book 📖
5. **8:15 AM** - Plan my day with colorful sticky notes!

This routine sets a positive, vibrant tone for the entire day. What's your morning ritual? ☀️`,
                category: 'daily-life',
                author: 'JaneSunriseGlow',
                date: '2024-01-14T08:15:00',
                likes: 8,
                liked: false
            },
            {
                id: '3',
                title: "🚀 Top 5 AI Tools That Will Change Your 2024",
                content: `The future is here! 🤖 Here are the AI tools I'm obsessed with:

**1. ChatGPT-4o** - Best conversational AI, perfect for brainstorming
**2. Midjourney v6** - Stunning AI art generation (just type "cyberpunk city at sunset")
**3. GitHub Copilot** - Your coding superpower (writes 70% of my code!)
**4. Runway ML** - Video generation from text (mind-blowing!)
**5. ElevenLabs** - AI voiceovers that sound human

Pro tip: Combine Midjourney + ElevenLabs for epic content creation! Which AI tool are you most excited about? 💻✨`,
                category: 'technology',
                author: 'AlexCodeWizard',
                date: '2024-01-13T14:22:00',
                likes: 25,
                liked: false
            },
            {
                id: '4',
                title: "✈️ Hidden Gems: 3 Secret Travel Spots You NEED to Visit",
                content: `Skip the tourist traps! Here are my secret travel gems:

🌺 **Secret Beach, Bali** - Crystal waters, no crowds, magical sunsets
🏔️ **Sapa Rice Terraces, Vietnam** - Breathtaking golden fields at dawn
🌅 **Giant's Causeway, Ireland** - Otherworldly hexagonal rock formations

**Travel Hack**: Visit during shoulder seasons (April/May or Sept/Oct) for perfect weather + fewer people. 

Where's your dream hidden gem? 🗺️✨`,
                category: 'travel',
                author: 'MiaWanderlustX',
                date: '2024-01-12T16:45:00',
                likes: 18,
                liked: false
            },
            {
                id: '5',
                title: "🍕 Ultimate Comfort Food Recipes for Rainy Days",
                content: `Rainy day = comfort food day! ☔ Here's my top 3 recipes:

**1. Cheesy Garlic Bread Pizza** (15 mins)
- Baguette + garlic butter + mozzarella + pepperoni = HEAVEN

**2. Creamy Tomato Basil Soup** 
- Fresh tomatoes + heavy cream + secret ingredient: smoked paprika!

**3. Chocolate Lava Cakes** 
- Gooey centers, 12 min bake time, pure bliss

Pair with a cozy movie and you're set! What's your ultimate rainy day comfort food? 🍫🧀`,
                category: 'food',
                author: 'EmmaFoodieQueen',
                date: '2024-01-11T19:30:00',
                likes: 15,
                liked: false
            }
        ];
    }

    // ... [Rest of the code remains exactly the same - no changes needed below this line]

    init() {
        this.bindEvents();
        this.loadPosts();
        this.updateStats();
        this.loadTheme();
    }

    bindEvents() {
        // Home page events
        const searchInput = document.getElementById('searchInput');
        const darkModeToggle = document.getElementById('darkModeToggle');
        const createForm = document.getElementById('createPostForm');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchPosts(e.target.value));
        }

        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }

        if (createForm) {
            createForm.addEventListener('submit', (e) => this.handleCreatePost(e));
        }

        // Event delegation for post actions
        document.addEventListener('click', (e) => this.handlePostActions(e));
    }

    loadPosts(filter = '') {
        const container = document.getElementById('postsContainer');
        const emptyState = document.getElementById('emptyState');

        if (!container) return;

        // Filter posts
        const filteredPosts = this.posts.filter(post => 
            post.title.toLowerCase().includes(filter.toLowerCase()) ||
            post.content.toLowerCase().includes(filter.toLowerCase())
        );

        container.innerHTML = '';

        if (filteredPosts.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        emptyState.style.display = 'none';

        filteredPosts.forEach((post, index) => {
            const postElement = this.createPostElement(post);
            container.appendChild(postElement);

            // Trigger animation
            setTimeout(() => {
                postElement.style.animationDelay = `${index * 0.1}s`;
            }, 100);
        });

        this.updateStats();
    }

    createPostElement(post) {
        const postCard = document.createElement('article');
        postCard.className = 'post-card';
        postCard.dataset.id = post.id;

        const categoryIcon = this.getCategoryIcon(post.category);
        const categoryClass = `category-${post.category}`;
        
        const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        postCard.innerHTML = `
            <div class="post-category ${categoryClass}">${categoryIcon} ${post.category.replace('-', ' ').toUpperCase()}</div>
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
                <span>✍️ ${post.author}</span>
                <span>📅 ${date}</span>
            </div>
            <div class="post-content">${marked.parse(post.content)}</div>
            <div class="post-actions">
               <button class="btn btn-like ${post.liked ? 'liked' : ''}" data-action="like">
               <i class="fas ${post.liked ? 'fas fa-heart' : 'far fa-heart'}"></i>
               ${post.likes} Likes
            </button>

             <button class="btn btn-comment" data-action="comment">
             💬 Comment
            </button>

            <button class="btn btn-share" data-action="share">
             🔗 Share
            </button>

    ${post.authorId === this.currentUser.id ? `
        <button class="btn btn-edit" data-action="edit">
            <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-delete" data-action="delete">
            <i class="fas fa-trash"></i> Delete
        </button>
    ` : ''}
</div>
            </div>
        `;

        return postCard;
    }

    getCategoryIcon(category) {
        const icons = {
            'books': '📚',
            'daily-life': '🌈',
            'technology': '💻',
            'travel': '✈️',
            'food': '🍕',
            'music': '🎵'
        };
        return icons[category] || '📝';
    }

    handlePostActions(e) {
        const button = e.target.closest('.btn');
        if (!button) return;

        const postCard = button.closest('.post-card');
        const postId = postCard.dataset.id;
        const action = button.dataset.action;

        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        switch (action) {
            case 'like':
                this.toggleLike(post);
                break;
            case 'edit':
                this.editPost(post);
                break;
            case 'delete':
                this.deletePost(postId);
                break;
            case 'comment':
                alert("💬 Comment feature coming soon!");
                break;

            case 'share':
                navigator.clipboard.writeText(window.location.href);
                alert("🔗 Link copied!");
                break;
        }
    }

    toggleLike(post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        this.savePosts();
        this.loadPosts(document.getElementById('searchInput')?.value || '');
    }

    editPost(post) {
        this.currentEditId = post.id;
        const createWin = window.open('create.html', '_self');
        // Store edit data in localStorage for create.html to pick up
        localStorage.setItem('editingPost', JSON.stringify(post));
    }

    deletePost(postId) {
        if (confirm('Delete this colorful post? 🌈')) {
            this.posts = this.posts.filter(p => p.id !== postId);
            this.savePosts();
            this.loadPosts();
        }
    }

    handleCreatePost(e) {
        e.preventDefault();
        
        const title = document.getElementById('postTitle').value;
        const category = document.getElementById('postCategory').value;
        const content = document.getElementById('postContent').value;
        
        const editingPost = localStorage.getItem('editingPost');
        
        if (editingPost) {
            // Update existing post
            const post = JSON.parse(editingPost);
            post.title = title;
            post.category = category;
            post.content = content;
            post.date = new Date().toISOString();
            this.savePosts();
            localStorage.removeItem('editingPost');
        } else {
            // Create new post with UNIQUE username
            const uniqueUsernames = [
                'PixelDreamer42', 'CosmicChef88', 'StarGazerLuna', 'CodeNinjaX', 
                'VividVoyager7', 'MelodyMaker23', 'RainbowRider99', 'TechTitanZ'
            ];
            const randomUsername = uniqueUsernames[Math.floor(Math.random() * uniqueUsernames.length)];
            
            const newPost = {
                id: Date.now().toString(),
                title,
                category,
                content,
                author: this.currentUser.name,
                authorId: this.currentUser.id,
                date: new Date().toISOString(),
                likes: 0,
                liked: false
            };
            this.posts.unshift(newPost);
            this.savePosts();
        }
        
        alert('🎉 Post published successfully!');
        window.location.href = 'index.html';
    }

    searchPosts(query) {
        this.loadPosts(query);
    }

    updateStats() {
        const totalPostsEl = document.getElementById('totalPosts');
        const totalLikesEl = document.getElementById('totalLikes');
        
        if (totalPostsEl) totalPostsEl.textContent = this.posts.length;
        if (totalLikesEl) {
            const totalLikes = this.posts.reduce((sum, post) => sum + post.likes, 0);
            totalLikesEl.textContent = totalLikes;
        }
    }

    savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }

    toggleDarkMode() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('darkMode', isDark ? 'false' : 'true');
        
        // Toggle icon
        const icon = document.querySelector('#darkModeToggle i');
        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }

    loadTheme() {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.setAttribute('data-theme', 'dark');
            document.querySelector('#darkModeToggle i').className = 'fas fa-sun';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogPlatform();
});

// Check if we're on create.html and handle edit mode
if (window.location.pathname.includes('create.html')) {
    const editingPost = localStorage.getItem('editingPost');
    if (editingPost) {
        const post = JSON.parse(editingPost);
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postContent').value = post.content;
        document.querySelector('.form-header h1').innerHTML = '<i class="fas fa-edit"></i> Edit Post';
        document.querySelector('.submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Post';
    }
}