/**
 * Demo currency list for FormMoney/MoneyEditModal - a complexes.TMoney value
 * (modules/fireback/complexes/TMoney.go) can carry a price in any currency
 * code, but an editor needs a concrete list of fields to render, the same
 * way useSupportedLocales() gives FormTString a concrete list of languages.
 *
 * A real deployment has this list already, as data: modules/finance/wallet's
 * walletCurrency entity (Wallet.emi.yml) is exactly "the currencies this
 * installation accepts", fetched via useWalletCurrencyBrowseAction - swap
 * this constant for that query's `code`s wherever a project wants the price
 * editor to offer exactly the currencies it actually sells in instead of
 * this fixed demo set.
 */
export const DEMO_CURRENCIES = ["USD", "EUR", "PLN", "IRR", "GBP"] as const;
