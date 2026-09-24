# Collaborating on AI Bazaar

## Join the repository

The owner needs each teammate's GitHub username to invite them to the private repository. Accept the invitation while signed in to your own account. Each person uses their own account and credentials.

## Set up each laptop

Install Git, accept your repository invitation, and clone the private repository:

```sh
git clone https://github.com/sayitjonovm5/ai-bazaar.git
cd ai-bazaar
git config user.name "Your Name"
git config user.email "Your verified GitHub email or GitHub no-reply email"
```

These identity settings apply only to this clone. Authenticate using your own account through Git Credential Manager or GitHub CLI. A GitHub account password is not a Git HTTPS password. Never put tokens in remote URLs or commit credentials.

## Make a change

Start with a clean working tree (`git status`); commit your current work on its branch before switching branches.

```sh
git switch main
git pull --ff-only origin main
git switch -c feature/short-description
```

Edit files, then review and commit only the files you intend to share. Replace the example file and message below as needed:

```sh
git diff
git add README.md
git diff --staged
git commit -m "Describe the change"
git push -u origin feature/short-description
```

On GitHub, open a pull request from your branch into `main`. Describe what changed and how you checked it, request a teammate's review, address feedback, and merge after agreement. Later commits pushed to the same branch update the pull request.

## Bring teammates' changes into your branch

With a clean working tree on your feature branch:

```sh
git fetch origin
git merge origin/main
```

If Git reports conflicts, edit the affected files to keep the intended content and remove conflict markers. Stage the resolved files, run `git commit`, and push. Use `git merge --abort` if you need to cancel an in-progress merge and discuss the resolution. Do not force-push shared branches.

After your pull request is merged:

```sh
git switch main
git pull --ff-only origin main
```

## Working from another laptop

Clone the same repository once on that laptop and configure your identity there. To continue an existing remote branch:

```sh
git fetch origin
git switch --track origin/feature/short-description
```

If the local branch already exists, switch to it and run `git pull --ff-only`. Commit and push before changing laptops; uncommitted files are not synchronized by GitHub.

## Repository owner checklist

- Create `ai-bazaar` as a private repository.
- Invite the actual team members through repository Settings > Collaborators and have them accept.
- Consider a rule requiring pull requests and a review on `main` if supported by the account plan.
- Agree on the application scope, stack, and checks before adding code or CI.

Do not commit `.env` files, API keys, access tokens, or private credentials. A safe `.env.example` may document variable names using dummy values.
