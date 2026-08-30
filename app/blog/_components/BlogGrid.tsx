'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'Hospital & Specialist Insights' | 'Healthcare Guides' | 'International Healthcare Support' | 'Recovery & Wellness';
  date: string;
  readTime: string;
  slug: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'How To Choose The Right Hospital For Specialized Treatment',
    excerpt: 'Choosing where to receive specialized care is one of the most important healthcare decisions a patient can make. Here is what actually matters.',
    category: 'Hospital & Specialist Insights',
    date: '10 Jul 2026',
    readTime: '5 min read',
    slug: 'how-to-choose-right-hospital',
  },
  {
    id: '2',
    title: 'Understanding Medical Reports: What Patients Should Know',
    excerpt: 'Medical reports are often dense and technical. Here is a practical guide to reading yours with more confidence.',
    category: 'Healthcare Guides',
    date: '2 Jul 2026',
    readTime: '4 min read',
    slug: 'understanding-medical-reports',
  },
  {
    id: '3',
    title: 'Preparing For Healthcare Treatment Abroad: A Practical Checklist',
    excerpt: 'Traveling for treatment involves more than medical preparation. Here is what families often overlook.',
    category: 'International Healthcare Support',
    date: '24 Jun 2026',
    readTime: '6 min read',
    slug: 'preparing-for-treatment-abroad',
  },
  {
    id: '4',
    title: 'Questions To Ask Before Choosing A Specialist',
    excerpt: 'A short list of questions that help you evaluate whether a specialist is the right fit for your situation.',
    category: 'Healthcare Guides',
    date: '15 Jun 2026',
    readTime: '3 min read',
    slug: 'questions-to-ask-before-choosing-specialist',
  },
  {
    id: '5',
    title: 'Understanding Medical Travel Documentation',
    excerpt: 'Medical visas and travel documentation can be confusing. Here is a plain-language overview.',
    category: 'International Healthcare Support',
    date: '5 Jun 2026',
    readTime: '4 min read',
    slug: 'understanding-medical-travel-documentation',
  },
  {
    id: '6',
    title: 'Supporting A Family Member Through Recovery',
    excerpt: 'Recovery is a family experience as much as a medical one. Practical ways to support a loved one.',
    category: 'Recovery & Wellness',
    date: '28 May 2026',
    readTime: '4 min read',
    slug: 'supporting-family-member-through-recovery',
  },
];

const categories = [
  'All',
  'Hospital & Specialist Insights',
  'Healthcare Guides',
  'International Healthcare Support',
  'Recovery & Wellness',
] as const;

export default function BlogGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter((article) => article.category === selectedCategory);

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div className="space-y-4">
                <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                  {article.category}
                </span>

                <h2 className="text-base sm:text-lg font-bold text-blue-900 leading-snug group-hover:text-blue-700 transition-colors">
                  {article.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              {/* Card Footer Meta */}
              <div className="pt-6 flex items-center justify-between text-xs text-gray-400 font-medium border-t border-gray-50 mt-4">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}