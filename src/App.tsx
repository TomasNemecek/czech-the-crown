import { useQuery } from "@tanstack/react-query";
import { fetchCnbDailyRates } from "@/api/cnb";
import { GlobalStyle, theme, Card } from "@/styles";
import { Logo } from "@/assets/Logo";
import { RateList } from "@/components/ratesList/RateList";
import { Converter } from "@/components/converter/Converter";
import { shouldRefetchRates } from "@/util/refetchLogic";
import styled from "styled-components";

export default function App() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["cnb", "daily"],
    queryFn: fetchCnbDailyRates,
    staleTime: 1000 * 60 * 60 * 24, // Consider data fresh for 24 hours
    refetchOnWindowFocus: (query) => {
      // Only refetch on window focus if it makes sense based on CNB schedule
      // Use the actual CNB data date instead of query execution time
      return shouldRefetchRates(query.state.data?.date);
    },
    refetchInterval: () => {
      // Disable automatic background refetching - prioritize window focus handling
      // to ensure users get the most current data when they return to the app
      return false;
    },
  });

  return (
    <>
      <GlobalStyle theme={theme} />
      <Shell>
        <HeaderBar>
          <Logo size={32} />
          <Title>Czech the Crown</Title>
        </HeaderBar>

        {/*TODO: make nicer loading component */}
        <Subtle>
          {isLoading && "Loading latest CNB exchange rates…"}
        </Subtle>

        {/* TODO: Make nicer error component */}
        {isError && (
          <Card role="alert">
            Failed to load: {(error as Error).message}{" "}
            <button onClick={() => refetch()}>Retry</button>
          </Card>
        )}

        {data && (
          <>
            <Converter dailyRates={data} />
            <div style={{ height: "var(--spacing-md)" }} />
            <RateList rates={data.rates} />
          </>
        )}
      </Shell>
    </>
  );
}

export const Shell = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: var(--spacing-xl);
`;

export const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

export const Title = styled.h1`
  margin: 0;
  font-size: var(--font-xxl);
`;

export const Subtle = styled.p`
  margin: var(--spacing-xs) 0 var(--spacing-lg);
  color: var(--subtle);
`;