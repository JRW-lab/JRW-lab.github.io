---
layout: default
title: NestArray
permalink: /nestarray/
---

This space merely acts as a main hub for my personal projects and thoughts. My more professional and useful projects can be found by clicking Home above, but my work found here is less serious.

<ul>
  {% for essay in site.essays %}
    <li>
      <a href="{{ essay.url }}">{{ essay.title }}</a> : {{essay.description}}
    </li>
  {% endfor %}
</ul>