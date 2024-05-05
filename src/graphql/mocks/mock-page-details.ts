export const mockPageDetails = {
    '1': { 
        '5000': { 
            url: 'https://www.example.com/page1',
            occurrences: [
                {
                    messageId: 14,
                    title: "Element has insufficient color contrast",
                    occurrenceId: 67501,
                    codeSnippet: "<div style='color:#ccc; background:#eee;'>Hard to read text</div>",
                    status: "active"
                },
                {
                    messageId: 30,
                    title: "Inaccessible button",
                    occurrenceId: 67502,
                    codeSnippet: "<button style='color:#fff; background:#ccc;'>Unclickable button</button>",
                    status: "active"
                },
            ]
        },
        '5001': {
            url: 'https://www.example.com/page2',
            occurrences: [
                {
                    messageId: 31,
                    title: "Missing alt attribute",
                    occurrenceId: 67510,
                    codeSnippet: "<img src='logo.png'>",
                    status: "active"
                }
            ]
        },
    },
    '2': {
        '4028': {
            url: 'https://www.example.com/page28',
            occurrences: [
                {
                    messageId: 15,
                    title: "Images missing alt attributes",
                    occurrenceId: 67511,
                    codeSnippet: "<img src='banner.jpg'>",
                    status: "active"
                },
                {
                    messageId: 16,
                    title: "Document does not have a lang attribute",
                    occurrenceId: 67512,
                    codeSnippet: "<html>",
                    status: "active"
                }
            ]
        }
    },
};