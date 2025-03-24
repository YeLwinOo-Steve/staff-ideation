interface CategoryChipProps {
  category: string;
}

export default function CategoryChip({ category }: CategoryChipProps) {
  return <div className="badge badge-primary badge-outline">{category}</div>;
}
