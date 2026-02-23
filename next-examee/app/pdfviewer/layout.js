// This layout overrides the root layout for /pdfviewer only.
// It intentionally omits Navbar and Footer so the PDF viewer
// fills the entire screen without any chrome around it.
export default function PdfViewerLayout({ children }) {
    return children;
}
