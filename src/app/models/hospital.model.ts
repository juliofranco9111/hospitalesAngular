interface _hospitalUser{
  _id: string
  img: string
  nombre: string;

}

export class Hospital {
  constructor(
    public nombre: string,
    public _id?: string,
    public img?: string,
    public usuario?: _hospitalUser,
  ) {}
}