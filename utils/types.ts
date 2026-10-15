// ------------------
// Data Types - Matches Excel and CSV column headers Extacly
// -----------------------------------------

export type AddressData={
    firstName:string;
    lastName:string;
    street: string;
    city: string;
    country: string;
}

export type SearchData = {
    keyword: string;
    maxPrice: string;
};