export const DESIGNATIONS = {
    ACADEMIC: [
        "Assistant Professor",
        "Associate Professor",
        "Professor",
        "Adjunct Professor",
        "Visiting Professor",
        "Research Professor",
        "Professor of Practice",
        "Senior Research Professor",
        "Young Scholar",
        "Emerging Scholar",
        "Academic Advisor"
    ],
    RESEARCH: [
        "Research Fellow",
        "Senior Fellow",
        "Principal Fellow",
        "Distinguished Fellow",
        "Global Fellow",
        "Resident Fellow",
        "Non-Resident Fellow",
        "Adjunct Fellow",
        "Visiting Fellow",
        "Guest Fellow",
        "Lead Researcher",
        "Research Associate",
        "Senior Research Associate",
        "Junior Research Fellow",
        "Graduate Researcher",
        "Graduate Research Fellow",
        "Research Assistant",
        "External Researcher",
        "Research Director",
        "Director of Research"
    ],
    ANALYST: [
        "Strategic Analyst",
        "Policy Analyst",
        "Economic Analyst",
        "Security Analyst",
        "Technology Policy Analyst",
        "Data Analyst",
        "Geopolitical Analyst",
        "Senior Policy Analyst",
        "Senior Analyst",
        "Senior Strategic Analyst",
        "Principal Analyst",
        "Lead Policy Analyst",
        "Junior Analyst",
        "Chief Economist",
        "Chief Geopolitical Analyst"
    ],
    EDITORIAL: [
        "Senior Editor",
        "Managing Editor",
        "Editor-in-Chief",
        "Research Editor",
        "Policy Editor",
        "Editorial Fellow",
        "Editorial Analyst",
        "Editorial Associate",
        "Publications Director"
    ],
    JOURNALISM: [
        "Journalist",
        "Senior Journalist",
        "Investigative Journalist",
        "Political Journalist",
        "Economic Journalist",
        "Foreign Affairs Journalist",
        "Defense Correspondent",
        "War Correspondent",
        "International Correspondent",
        "Senior Correspondent",
        "Staff Writer",
        "News Analyst",
        "Policy Commentator"
    ],
    STUDENT: [
        "Undergraduate Researcher",
        "Student Researcher",
        "Student Fellow",
        "Student Contributor",
        "Research Intern",
        "Editorial Intern",
        "Policy Research Intern"
    ],
    ADVISORY: [
        "Senior Advisor",
        "Strategic Advisor",
        "Policy Advisor",
        "Research Advisor",
        "Advisory Board Member",
        "Board Fellow",
        "Distinguished Advisor",
        "Chief Strategy Officer"
    ]
};

export const EXCEPTION_DESIGNATION = "Other / Institutional Specific...";

// Helper to get a flat list of all selectable designations including the exception
export const getSelectableDesignations = () => {
    const list = Object.values(DESIGNATIONS).flat();
    list.push(EXCEPTION_DESIGNATION);
    return list;
};
