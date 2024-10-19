"use client";

import { useEffect, useState } from "react";
import { Option, AsyncData, Result } from "@swan-io/boxed";
import { Flex, Show, Text } from "@chakra-ui/react";

import MainLayout from "@/components/layouts/main-layout";
import TestResult from "@/components/test/test-result";
import TestResultTableOfContent from "@/components/test/test-result-table-of-content";
import TestResultStats from "@/components/test/test-result-stats";
import {
  TestResult as ITestResult,
  getSavedTestResult,
} from "@/lib/personality-test";

// Assuming you're using the app directory and getting params
export default function TestResultPage({ params }: { params: { testResultId: string } }) {
  const [testResult, setTestResult] = useState<
    AsyncData<Result<Option<ITestResult>, Error>>
  >(AsyncData.NotAsked());

  useEffect(() => {
    if (params.testResultId) {
      setTestResult(AsyncData.Loading());

      const id = parseInt(params.testResultId); // Use the dynamic route param

      getSavedTestResult(id).tap((result) =>
        setTestResult(AsyncData.Done(result))
      );
    }
  }, [params.testResultId]); // Use params instead of router

  return (
    <MainLayout>
      {testResult.match({
        NotAsked: () => <Text>Loading</Text>,
        Loading: () => <Text>Loading</Text>,
        Done: (result) =>
          result.match({
            Error: () => <Text>Something went wrong! Please refresh!</Text>,
            Ok: (value) =>
              value.match({
                Some: (data) => (
                  <Flex
                    h="full"
                    direction={{
                      base: "column",
                      lg: "row",
                    }}
                  >
                    <TestResultStats testResult={data} />
                    <TestResult testResult={data} />
                    <Show above="lg">
                      <TestResultTableOfContent />
                    </Show>
                  </Flex>
                ),
                None: () => <Text>No Data</Text>,
              }),
          }),
      })}
    </MainLayout>
  );
}
