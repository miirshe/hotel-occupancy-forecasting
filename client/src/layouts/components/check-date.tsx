"use client";
import React, { useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import ChartComponent from "./ChartComponent";
const CheckDate = () => {
  const [data, setData] = useState<any>(null);
  console.log("data:", data);
  const formSchema = yup.object({
    check_in_date: yup.date().required("Check-in date is required"),
    check_out_date: yup.date().required("Check-out date is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (formValues: any) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          check_in_date: moment(formValues.check_in_date).format("YYYY-MM-DD"),
          check_out_date: moment(formValues.check_out_date).format(
            "YYYY-MM-DD",
          ),
        }),
        cache: "no-cache",
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Response data:", response);
        setData(data);
      } else {
        console.log("Response error:", response);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  return (
    <>
      <div className="container flex items-center justify-center my-20">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          <div className="space-y-2">
            <label htmlFor="check_in_date">Check In Date</label>
            <Controller
              name="check_in_date"
              control={form.control}
              render={({ field }) => (
                <input
                  className="w-full p-3 rounded-md shadow"
                  type="date"
                  id="check_in_date"
                  {...field}
                />
              )}
            />
            {form.formState.errors.check_in_date && (
              <p className="text-red-600">
                {form.formState.errors.check_in_date.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="check_out_date">Check Out Date</label>
            <Controller
              name="check_out_date"
              control={form.control}
              render={({ field }) => (
                <input
                  className="w-full p-3 rounded-md shadow"
                  type="date"
                  id="check_out_date"
                  {...field}
                />
              )}
            />
            {form.formState.errors.check_out_date && (
              <p className="text-red-600">
                {form.formState.errors.check_out_date.message}
              </p>
            )}
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="w-full mt-3 px-4 py-3 bg-blue-500 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {data ? <ChartComponent data={data} /> : ''}
    </>
  );
};

export default CheckDate;
