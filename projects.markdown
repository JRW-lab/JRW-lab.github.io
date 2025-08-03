---
layout: default
title: Projects
permalink: /projects/
---

A list of some of my professional projects can be found below. <br>
Links to their corresponding GitHub repositories are included within each page.

<ul class="post-list">
  {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
  {%- for post in site.posts -%}
    {%- if post.categories contains "Project" -%}
      <li>
        <h3>
          <a class="post-link" href="{{ post.url | relative_url }}">
            {{ post.title | escape }}
          </a>
        </h3>
      </li>
    {%- endif -%}
  {%- endfor -%}
</ul>