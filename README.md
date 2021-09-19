# Gitential ReactJS Coding Challenge

## The Challenge

At Gitential, we often deal with APIs and software development related data.

For your challenge, we already put together a simple front-end development environment with ReactJS and some extra dependencies.
Your task is to finish this small Application, by following the User Stories.

## Setup the environment

To get started with the implementation, you should install the necesarry dependencies and start the dev server:

```
npm install
npm run start
```

Visit *http://localhost:3000/* in your browser. You should se an application with three navigation options on the top.

* *Settings*: The application talks directly to GitHub API and needs a GitHub Personal Access Token for that. This view has an input field where users can add and modify the token.
* *Repositores*: Using the token, the application can do a quick search and add available repositories to the repository list. The user can select one repository for analytics.
* *PR Analytics*: This is an empty view for now. It's going to be your job to implement it.

## User Stories

### First User Story

**As a User I want to see the recent 100 pull requests for the selected GitHub repository.**

Implementation details:
* When there is at least one repository in the repository list and the repository is selected, use GitHub API to get the recent 100 pull requests for that repository and display a nice simple table.
* The table should include the following Columns:
    * ID (the pr number)
    * State (open, closed, merged)
    * Title
    * Labels (list of string)
    * Created At
    * Created by (username)

* Example: if the user types in "kubernetes/kubernetes" you can get the list off PRs on the following URL:
`https://api.github.com/repos/kubernetes/kubernetes/pulls`

* Coloring and style for labels is optinal
* Handle the case if the repository is no longer exists or has no pull requests at all.


### Second User Story

**As a User I want to see a bar chart on how many pull requests created daily for the given GitHub repository.**

Implementation details:

* Use the data from the GitHub API response used for the first story.
* Use Plotly.js to construct a bar chart where the X-Axis is the calendar day and the Y-Axis is the number of Prs for the day.
* Ideally
* Layout: place the new bar chart on the top of the view. (The table should be under the chart)
* You can apply some styling to the chart, no specific requirements here. Whatever makes it more easier to read.



### Third User Story

**As a User I want to search in the pull request titles and limit the table and chart data to the matching PRs only**


Implementation details:

* Add another component to the PR Analytics view: a search input field.
* If the user types in at least 2 characters, limit the table and chart display to only the matching pull requests.
* Example: If the user types in "bug" show only the pull requests where the title contains the word "bug" or "Bug" or ... (case-insensitivity)


## Useful links:
* https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token
* https://docs.github.com/en/rest/reference/pulls

