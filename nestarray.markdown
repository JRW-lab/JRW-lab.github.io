---
layout: default
title: NestArray
permalink: /nestarray/
---

![NestArray Banner](/assets/images/nestarray-banner.png)

This section is a main hub for my personal projects and thoughts. My more professional projects can be found on the <a href="/">Home Page</a>, but the work found here is less serious.

### Essays

<ul>
  {% for essay in site.essays %}
    <li>
      <a href="{{ essay.url }}">{{ essay.title }}</a>: {{essay.description}}
    </li>
  {% endfor %}
</ul>

### Widgets

<ul>
  {% for widget in site.widgets %}
    <li>
      <a href="{{ widget.url }}">{{ widget.title }}</a>: {{widget.description}}
    </li>
  {% endfor %}
</ul>