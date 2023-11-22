<p align="center">
  <b>
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/repohistory/repohistory/assets/74842863/f6e17fa3-3b2a-4032-a869-d3ca560ff522">
      <img alt="Slogan banner: Effortless Tracking Timeless Insights." src="https://github.com/repohistory/repohistory/assets/74842863/3b321e1e-c8de-4aa8-928e-a73d382e197d">
    </picture>
    Repohistory is an open-source platform for tracking GitHub repo traffic history longer than 14 days, offering an easy and detailed long-term view.
  </b>
</p>

![github](https://github.com/repohistory/repohistory/assets/74842863/e0cb2fad-f2d1-4a1f-a418-996ab11dde2a)

Find out more at https://repohistory.com

## 🎯 Motivation

GitHub's 14-day limit on repository data often leaves developers without vital long-term insights. Repohistory addresses this by offering an easy-to-setup, beautifully designed interface for extended repository tracking. This gives developers a powerful tool to analyze trends and progress over time, not just a brief snapshot.

## ✨ Features

- 📊 **Data Tracking**: Start tracking clones and views data from your first login.
- 📈 **All-Time Stars History**: Visualize the growth of your repo with an all-time stars history graph.
- 🖥️ **Dashboard Overview**: Easily access a dashboard view for an overview of all your projects.

## ❓ FAQ

<details>
<summary><b>Q1: Why is there a limit of tracking only two repositories per user?</b></summary>
We're using Supabase's free plan, which has certain usage limits. The two-repo limit helps us stay within these quotas. As Repohistory grows, we plan to revisit and potentially increase this limit based on our capacity and project's expansion.
</details>

<details>
<summary><b>Q2: What permissions does Repohistory require on my GitHub account?</b></summary>
Repohistory uses GitHub Apps to request specific permissions from users. We require read access to <a href="https://docs.github.com/en/rest/overview/permissions-required-for-github-apps?apiVersion=2022-11-28#repository-permissions-for-metadata">Metadata</a> for basic information, and read access to <a href="https://docs.github.com/en/rest/overview/permissions-required-for-github-apps?apiVersion=2022-11-28#repository-permissions-for-administration">Administration</a> for traffic data.
</details>

<details>
<summary><b>Q3: Can Repohistory retrieve data older than 14 days?</b></summary>
No, GitHub provides access to data only for the past 14 days. However, Repohistory will accumulate and make available data extending beyond the 14-day limit from your first login.
</details>

## 📚 Stack

- Language: `Typescript`
- UI: `Tailwind CSS`, `NextUI`
- Front-End: `Next.js (App Router)`
- Database: `Supabase`
- Cron Job: `GitHub Action`

## 🦾 Contributing

All contributions are welcome! Just open a pull request.
