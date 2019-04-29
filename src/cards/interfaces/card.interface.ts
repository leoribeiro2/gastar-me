interface ExpirationInterface {
  month: number;
  year: number;
}

export interface CardInterface {
  number: string;
  cardHolderName: string;
  cvv: number;
  expiration: ExpirationInterface;
  creditLimit: number;
  closingDay: number;
}
