export function WordCounter({ text }: { text: string }) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <span className="text-xs text-muted-foreground">
      {words} word{words !== 1 ? 's' : ''}
    </span>
  );
}

export function CharacterCounter({ text, max }: { text: string; max?: number }) {
  const chars = text.length;
  const isNearLimit = max && chars > max * 0.9;
  const isOverLimit = max && chars > max;

  return (
    <span className={`text-xs ${isOverLimit ? 'text-destructive font-semibold' : isNearLimit ? 'text-amber-500' : 'text-muted-foreground'}`}>
      {chars} {max ? `/ ${max}` : ''} char{chars !== 1 ? 's' : ''}
    </span>
  );
}
