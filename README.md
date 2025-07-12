# My Portfolio

Welcome to my personal portfolio! This project showcases my skills, projects, and experience as a developer.

## 🚀 Features

- Project highlights with live demo and code links
- About me section
- Contact information
- Add/Edit/Delete projects (with authentication)
- Google Authenticator OTP for secure project management
- Bulk project import with JSON validation
- **Favorites system**: Mark and filter your favorite projects
- **Grid/List view toggle**: Switch between beautiful card and compact list layouts
- **Project statistics dashboard**: See total projects, favorites, views, and more
- **Keyboard shortcuts**: Fast navigation and actions (see in-app help for full list)
- **Project view tracking**: See which projects are most viewed
- **ProjectDetailsDialog**: Click any project for a full details dialog
- **ShadCN Select**: Modern dropdowns for category and sorting
- **Responsive, modern UI** (Next.js, TailwindCSS, ShadCN)
- **Accessibility**: Keyboard navigation, ARIA labels, and focus management

## 🛠️ Technologies Used

- TypeScript
- React & Next.js
- TailwindCSS
- ShadCN UI (including Select, Dialog, Tabs, etc.)
- PostgreSQL (via @vercel/postgres)
- Google Authenticator (OTP)
- Sonner (toast notifications)
- Ajv (JSON schema validation)

## 🔐 Authentication & Security

- Project management (add/edit/delete) is protected by username/password and OTP (Google Authenticator).
- To set up OTP, scan the QR code in the dialog or use the provided secret key in your authenticator app.
- Set your secret key in `.env` as `SECRET_KEY=YOUR_BASE32_SECRET`.

## 🧑‍💻 Usage Tips

- **Keyboard Shortcuts**: Press the ⌨️ Shortcuts button in the UI for a full list.
- **Favorites**: Click the ⭐ on any project to favorite/unfavorite it.
- **Switch Views**: Use the Grid/List toggle or ⌘G.
- **Project Details**: Click any project card or row for a full dialog.
- **Export**: Download filtered projects as JSON or CSV.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to reach out or contribute!