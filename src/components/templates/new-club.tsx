import React from "react";

export default function TemplateNewClub({ club = {} }: any) {
  // Define a single array for sections
  const sections = [
    {
      title: "Club Information",
      items: [
        {
          label: "Name",
          value: club.name,
        },
        {
          label: "Username",
          value: club.username,
        },
      ],
    },
    {
      title: "Contact Information",
      items: [
        {
          label: "Name",
          value: club.contact_name,
        },
        {
          label: "Email",
          value: club.email,
        },
        {
          label: "Phone",
          value: club.phone,
        },
      ],
    },
  ];

  return (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "12px",
      }}
    >
      <tbody>
        <tr>
          <td
            style={{
              textAlign: "left",
            }}
          >
            <h1 style={{ fontSize: "24px", margin: "0 0 20px", color: "#333" }}>
              New club was created!
            </h1>
          </td>
        </tr>

        {/* Render each section dynamically */}
        {sections.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            <tr>
              <td
                style={{
                  textAlign: "left",
                }}
              >
                <h2
                  style={{
                    fontSize: "16px",
                    margin: "0 0 10px",
                    color: "#555",
                  }}
                >
                  {section.title}
                </h2>
              </td>
            </tr>
            {section.items.map((item, itemIndex) => (
              <tr key={itemIndex}>
                <td
                  style={{
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      color: "#333",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    {item.label}: {item.value}
                  </span>
                </td>
              </tr>
            ))}
          </React.Fragment>
        ))}

        <tr>
          <td
            style={{
              textAlign: "left",
            }}
          >
            <a
              href={`https://admin.athlt.link/clubs/${club.username}`}
              style={{
                display: "inline-block",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "5px",
                marginTop: "20px",
              }}
            >
              Open team page
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
