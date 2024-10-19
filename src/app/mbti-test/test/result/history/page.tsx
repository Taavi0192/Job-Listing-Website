"use client";

import { useState, useEffect } from "react";
import { Option, AsyncData, Result } from "@swan-io/boxed";
import { Text } from "@chakra-ui/react";

import MainLayout from "@/components/layouts/main-layout";
import TestResultHistory from "@/components/test/test-result-history";
import { TestResult, getAllSavedTestResult } from "@/lib/personality-test";

export default function TestResultHistoryPage() {
  const [testResults, setTestResults] = useState<
    AsyncData<Result<Option<TestResult[]>, Error>>
  >(AsyncData.NotAsked());

  useEffect(() => {
    setTestResults(AsyncData.Loading());

    getAllSavedTestResult().tap((result) =>
      setTestResults(AsyncData.Done(result))
    );
  }, []); // Removed router dependency and just use an empty dependency array

  return (
    <MainLayout>
      {testResults.match({
        NotAsked: () => <Text>Loading</Text>,
        Loading: () => <Text>Loading</Text>,
        Done: (result) =>
          result.match({
            Error: () => <Text>Something went wrong! Please refresh!</Text>,
            Ok: (value) =>
              value.match({
                Some: (data) => <TestResultHistory testResults={data} />,
                None: () => <Text>No Data</Text>,
              }),
          }),
      })}
    </MainLayout>
  );
}
