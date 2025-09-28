(function () {
  const postList = document.getElementById("post-list");
  const yearSpan = document.getElementById("current-year");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (!postList) return;

  const fallbackPosts = Array.isArray(window.staticPosts)
    ? window.staticPosts.slice()
    : [];

  const formatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const renderPosts = (postEntries) => {
    postList.innerHTML = "";

    postEntries
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((post) => {
        const li = document.createElement("li");
        li.className = "article-card";

        const fallbackDate = new Date();
        const candidateDate = post.date ? new Date(post.date) : null;
        const renderDate =
          candidateDate && !Number.isNaN(candidateDate.valueOf())
            ? candidateDate
            : fallbackDate;
        const isoDate =
          candidateDate && !Number.isNaN(candidateDate.valueOf())
            ? post.date
            : fallbackDate.toISOString();
        const href = post.url || (post.slug ? `posts/${post.slug}.html` : "#");
        const summary = post.summary ?? "";
        const title = post.title ?? "Untitled";

        li.innerHTML = `
          <time datetime="${isoDate}">${formatter.format(renderDate)}</time>
          <h2><a href="${href}">${title}</a></h2>
          <p>${summary}</p>
        `;

        const tags = Array.isArray(post.tags)
          ? post.tags
          : typeof post.tags === "string" && post.tags
          ? post.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [];

        if (tags.length) {
          const tagEl = document.createElement("p");
          tagEl.setAttribute("aria-label", "Post tags");
          tagEl.style.marginTop = "0.75rem";
          tagEl.style.fontSize = "0.9rem";
          tagEl.style.color = "var(--color-muted)";
          tagEl.textContent = tags.map((tag) => `#${tag}`).join("  ");
          li.appendChild(tagEl);
        }

        postList.appendChild(li);
      });
  };

  const fetchSupabasePosts = async (config) => {
    if (!config?.url || !config?.anonKey) return null;

    const table = config.table || "posts";
    const searchParams = new URLSearchParams({
      select: "title,summary,slug,url,published_at,tags,date",
      order: "published_at.desc",
    });

    try {
      const response = await fetch(`${config.url}/rest/v1/${table}?${searchParams.toString()}`, {
        headers: {
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Supabase request failed with ${response.status}`);
      }

      const payload = await response.json();

      if (!Array.isArray(payload)) return [];

      return payload.map((item) => ({
        title: item.title,
        summary: item.summary,
        slug: item.slug,
        url: item.url,
        tags: item.tags,
        date: item.published_at || item.date || new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Failed to load posts from Supabase", error);
      return [];
    }
  };

  (async function init() {
    const config = window.__SUPABASE_CONFIG__;

    let posts = fallbackPosts;

    if (config?.url && config?.anonKey) {
      const supabasePosts = await fetchSupabasePosts(config);
      if (Array.isArray(supabasePosts) && supabasePosts.length) {
        posts = supabasePosts;
      }
    }

    renderPosts(posts);
  })();
})();
