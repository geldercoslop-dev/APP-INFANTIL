export function requireOnline(isOnline: boolean, actionName: string): boolean {
  if (!isOnline) {
    alert(`Sem internet: não dá para ${actionName} agora.`);
    return false;
  }
  return true;
}
