"use client";

import { useEffect } from 'react';

export default function MetaTags() {
  useEffect(() => {
    const ogImageUrl = process.env.NEXT_PUBLIC_SITE_URL + '/og-image.png';
    
    // Update meta tags dynamically
    const metaTags = [
      {
        property: "og:image",
        content: ogImageUrl
      },
      {
        property: "og:image:width",
        content: "1200"
      },
      {
        property: "og:image:height",
        content: "630"
      },
      {
        property: "og:image:alt",
        content: "Monday.xyz - Premium Crypto Domain"
      },
      {
        property: "og:site_name",
        content: "Monday.xyz"
      },
      {
        name: "twitter:site",
        content: "@monday_xyz"
      },
      {
        name: "twitter:creator",
        content: "@monday_xyz"
      },
      {
        name: "twitter:image",
        content: ogImageUrl
      }
    ];

    // Add or update meta tags
    metaTags.forEach(tag => {
      let element = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        if (tag.property) element.setAttribute('property', tag.property);
        if (tag.name) element.setAttribute('name', tag.name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', tag.content);
    });

    // Cleanup function
    return () => {
      metaTags.forEach(tag => {
        const selector = `meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`;
        document.querySelector(selector)?.remove();
      });
    };
  }, []);

  return null;
}
