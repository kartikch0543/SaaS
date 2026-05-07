import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "./HomePage";

vi.mock("../api/client", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        items: []
      }
    })
  }
}));

test("renders main home hero content", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  render(
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );

  expect(screen.getByText(/Turn syllabus chaos into focused prep/i)).toBeInTheDocument();
});
