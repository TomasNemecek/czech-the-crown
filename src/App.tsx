import { useQuery } from "@tanstack/react-query";
import { fetchCnbDailyRates } from "@/api/cnb";
import { GlobalStyle, Shell, HeaderBar, Title, Subtle, Card } from "@/styles";
import { Logo } from "@/assets/Logo";
import { RateList } from "@/components/ratesList/RateList";
import { theme } from "@/theme";
import { Converter } from "@/components/converter/Converter";
import { shouldRefetchRates } from "@/util/refetchLogic";

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
          {data && (
            <>
              Valid for {data.date} (#{data.sequence})
            </>
          )}
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
            <div style={{ height: 12 }} />
            <RateList rates={data.rates} />
          </>
        )}
      </Shell>
    </>
  );
}
