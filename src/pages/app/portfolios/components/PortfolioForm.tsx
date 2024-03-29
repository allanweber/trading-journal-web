import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import { useToast } from "components/ui/use-toast";
import { useForm } from "react-hook-form";

import { CurrencySelect } from "components/CurrencySelect";
import { DateTimePicker } from "components/DateTimePicker";
import { HelperText } from "components/HelperText";
import { MessageDisplay } from "components/MessageDisplay";
import { NumberInput } from "components/NumberInput";
import { PageHeader } from "components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { usePortfolioContext } from "contexts/PortfolioContext";
import { getSymbol } from "model/currency";
import { Portfolio, portfolioSchema } from "model/portfolio";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSavePortfolio } from "service/portfolioQueries";
import { DeletePortfolioButton } from "./DeletePortfolioButton";

export const PortfolioForm = ({ portfolio }: { portfolio?: Portfolio }) => {
  const startValues = {
    name: "",
    description: "",
    startDate: new Date(),
    startBalance: 0,
    currency: "USD",
  };

  const [values, setValues] = useState<Portfolio>(portfolio || startValues);
  const [deleteError, setDeleteError] = useState<any>(null);
  const navigate = useNavigate();
  const { setPortfolio } = usePortfolioContext();
  const { toast } = useToast();

  const mutation = useSavePortfolio();
  useEffect(() => {
    if (portfolio) {
      setValues(portfolio);
    }
  }, [portfolio]);

  const form = useForm<Portfolio>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: values,
    values,
  });

  function onSubmit(data: Portfolio) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Portfolio saved",
          description: `Your portfolio ${data.name} was saved successfully`,
        });
        setPortfolio(data);
        navigate("/trading/portfolios");
      },
    });
  }

  return (
    <>
      <MessageDisplay message={mutation.error} variant="destructive" />
      <MessageDisplay message={deleteError} variant="destructive" />
      <Card>
        <CardHeader>
          <CardTitle>
            <PageHeader>
              <PageHeader.Title>{portfolio ? "Edit" : "Add a new"} Portfolio</PageHeader.Title>
              <PageHeader.Action>
                {portfolio && (
                  <DeletePortfolioButton
                    portfolio={portfolio!}
                    onError={(error) => setDeleteError(error)}
                  />
                )}
              </PageHeader.Action>
            </PageHeader>
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-3 pr-3 sm:pr-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Portfolio Name" {...field}>
                        <HelperText>
                          This is the name of your portfolio that will be displayed everywhere.
                          (required)
                        </HelperText>
                      </Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Portfolio Description" {...field}>
                        <HelperText>
                          This is just a brief description of your portfolio. (optional)
                        </HelperText>
                      </Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <DateTimePicker {...field} disabled={portfolio}>
                      <HelperText>
                        This is the date when you started your portfolio, used to calculate your
                        balance, and can never be changed. (required)
                      </HelperText>
                    </DateTimePicker>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startBalance"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Balance</FormLabel>
                    <NumberInput
                      {...field}
                      disabled={portfolio}
                      currency={getSymbol(form.getValues("currency") || "$")}
                    >
                      <HelperText>
                        This is the balance of your account at the start of your portfolio, and can
                        never be changed. (required)
                      </HelperText>
                    </NumberInput>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Portfolio Currency</FormLabel>
                    <CurrencySelect {...field}>
                      <HelperText className="right-9">
                        This is the currency of your portfolio that will be shown for all your
                        trades. (required)
                      </HelperText>
                    </CurrencySelect>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap sm:justify-end">
                <Button
                  variant="outline"
                  className="w-full sm:w-[200px]"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full mt-2 sm:w-[200px] sm:ml-3 sm:mt-0"
                  disabled={mutation.isPending}
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
