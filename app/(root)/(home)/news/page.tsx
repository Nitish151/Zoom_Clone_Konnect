"use client";

import { useEffect, useState } from "react";

const NewsComponent = () => {
  const [newsItems, setNewsItems] = useState<{ title: string; link: string }[]>(
    []
  );

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/reuterNews");
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        setNewsItems(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 border-b border-gray-800 pb-4">
          Latest News
        </h1>

        {newsItems.length === 0 ? (
          <p className="text-gray-400 text-lg">No news items found.</p>
        ) : (
          <ul className="space-y-4">
            {newsItems.map((item, index) => (
              <li
                key={index}
                className="transition-all duration-200 hover:translate-x-2"
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-lg flex items-center group"
                >
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NewsComponent;
