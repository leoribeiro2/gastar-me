interface LimitsInterface {
  used: number;
  total: number;
  remaining: number;
}

export interface CardInterface {
  id: string;
  number: string;
  cardHolderName: string;
  cvv: number;
  expirationDate: Date;
  limits: LimitsInterface;
  closingDay: number;
  remainingDaysForClose: number;

  save();
}
