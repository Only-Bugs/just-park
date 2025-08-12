export default {
  appBar: {
    backgroundColor: "#ffffff",
    color: "#333",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  toolbar: {
    justifyContent: "space-between",
    gap: 2,
    paddingX: 2,
    flexWrap: "wrap",
  },
  logo: {
    fontWeight: "bold",
    color: "#1976d2",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: "4px 10px",
    borderRadius: "4px",
    flex: 1,
    maxWidth: 400,
    marginX: 2,
  },
  searchIcon: {
    marginRight: "8px",
    color: "#888",
  },
  searchInput: {
    flex: 1,
    color: "inherit",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 3,
  },
  link: {
    cursor: "pointer",
    fontWeight: 500,
    color: "#555",
    textDecoration: "none",
    "&:hover": {
      color: "#1976d2",
    },
  },
  activeLink: {
    color: "#1976d2",
    fontWeight: 700,
  },
};
