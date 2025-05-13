// utils/planUtils.ts
import { Plan, PlanCategory } from "../types";

export const findPlanById = (
  categories: PlanCategory[],
  planId: string,
): Plan | null => {
  for (const category of categories) {
    const plan = category.options.find((p) => p.id === planId);
    if (plan) return plan;
  }
  return null;
};

export const calculateTotalCost = (plan: Plan): number => {
  const monthlyMatch = plan.price.match(/\$(\d+)/);
  const initFeeMatch = plan.initiationFee.match(/\$(\d+)/);

  const monthlyPrice = monthlyMatch ? parseInt(monthlyMatch[1]) : 0;
  const initiationFee = initFeeMatch ? parseInt(initFeeMatch[1]) : 0;

  return monthlyPrice + initiationFee;
};
