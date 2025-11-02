export function isValidCpf(cpf: string): boolean {
  const digits = (cpf || '').replace(/\D/g, '');
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  const calc = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i++) total += parseInt(base[i]) * (factor - i);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calc(digits.slice(0, 9), 10);
  const d2 = calc(digits.slice(0, 10), 11);

  return d1 === parseInt(digits[9]) && d2 === parseInt(digits[10]);
}
