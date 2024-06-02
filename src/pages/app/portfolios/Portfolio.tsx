import { zodResolver } from "@hookform/resolvers/zod";
import { MessageDisplay } from "components/MessageDisplay";
import { TableLoading } from "components/table/TableLoading";
import { useToast } from "components/ui/use-toast";
import { portfolioSchema, type Portfolio as PortfolioType } from "model/portfolio";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePortfolio, useGetPortfolio, useSavePortfolio } from "service/portfolioQueries";

import { Button } from "components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";

import { DialogClose } from "@radix-ui/react-dialog";
import { CurrencySelect } from "components/CurrencySelect";
import { DateTimePicker } from "components/DateTimePicker";
import { HelperText } from "components/HelperText";
import { NumberInput } from "components/NumberInput";
import { PageHeader } from "components/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { getSymbol } from "model/currency";
import { PortfolioEntries } from "./components/PortfolioEntries";

export const Portfolio = () => {
  const { portfolioId } = useParams();
  const { data: portfolio, isLoading, error: queryError } = useGetPortfolio(portfolioId);
  const deleteMutation = useDeletePortfolio();
  const [values, setValues] = useState<PortfolioType>({
    name: "",
    description: "",
    startDate: new Date(),
    startBalance: 0,
    currency: "USD",
  });
  const [portfolioName, setPortfolioName] = useState<string>("");

  useEffect(() => {
    if (portfolio) {
      setValues(portfolio);
    }
  }, [portfolio]);

  const mutation = useSavePortfolio();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<PortfolioType>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: values,
    values,
  });

  if (isLoading) {
    return <TableLoading />;
  }

  if (queryError) {
    return <MessageDisplay message={queryError} variant="destructive" />;
  }

  function onSubmit(data: PortfolioType) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Portfolio saved",
          description: `Your portfolio ${data.name} was saved successfully`,
        });
        navigate("/trading/portfolios");
      },
    });
  }

  function deletePortfolio() {
    if (portfolioName === portfolio?.name) {
      deleteMutation.mutate(portfolioId!, {
        onSuccess: () => {
          toast({
            title: "Portfolio deleted",
            description: `Your portfolio ${portfolio?.name} was deleted successfully`,
          });
          navigate("/trading/portfolios");
        },
      });
    } else {
      toast({
        title: "Portfolio name doesn't match",
        description: "You need to type the portfolio name to confirm",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="p-2 md:p-4">
      <div className="flex flex-col gap-3">
        <div>
          <MessageDisplay message={mutation.error} variant="destructive" />

          <Card>
            <CardHeader>
              <CardTitle>
                <PageHeader>
                  <PageHeader.Title>{portfolio ? "Edit" : "Add a new"} Portfolio</PageHeader.Title>
                </PageHeader>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                            This is the balance of your account at the start of your portfolio, and
                            can never be changed. (required)
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
                      type="button"
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
        </div>

        {portfolio && (
          <>
            <div>
              <PortfolioEntries portfolio={portfolio} />
            </div>

            <div>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Danger Zone</AlertTitle>
                <AlertDescription>
                  Be careful, when deleting a portfolio, this action is irreversible. All
                  information related to this portfolio will be removed.
                </AlertDescription>
                <AlertDescription className="py-5 pb-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Delete Portfolio</Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Confirm the portfolio name to delete <span>{portfolio.name}</span>
                        </DialogTitle>
                      </DialogHeader>
                      <Input
                        placeholder="Type DELETE to confirm"
                        value={portfolioName}
                        onChange={(value) => setPortfolioName(value.target.value)}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={() => deletePortfolio()}>Save changes</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </AlertDescription>
              </Alert>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
