import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "./HomePage";

test("renders main home hero content", () => {
  render(
    <HelmetProvider>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </HelmetProvider>
  );

  expect(screen.getByText(/Turn syllabus chaos into focused prep/i)).toBeInTheDocument();
});
