export type OrderStatus = 'BUDGETED' | 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';

export type TransactionType = 'INCOME' | 'EXPENSE';

export type TransactionCategory = 
  | 'Venta Presencial'
  | 'Mercado Libre'
  | 'Instagram'
  | 'Insumos'
  | 'Servicios'
  | 'Otros';

export interface PrintComponent {
  id?: string;
  name: string; // e.g., "Caja / Base", "Tapa / Difusor"
  filament_id: string;
  grams_required: number;
  print_time_hours: number;
}

export interface SupplyComponent {
  supply_id: string;
  quantity_required: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  stock_quantity: number;
  min_stock_alert: number;
  unit_cost: number;
  sale_price: number;
  tags: string[];
  components?: PrintComponent[];
  supplies?: SupplyComponent[];
  created_at: string;
  updated_at: string;
}

export interface Supply {
  id: string;
  name: string;
  unit_cost: number;
  stock_quantity: number;
  unit_of_measure: 'unit' | 'ml' | 'grams';
  min_stock_alert: number;
  created_at: string;
}

export interface Filament {
  id: string;
  brand: string;
  type: string;
  color: string;
  cost_per_gram: number;
  stock_grams: number;
  min_stock_alert: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  item_name: string;
  quantity: number;
  unit_cost: number;
  unit_sale_price: number;
  calculation_snapshot?: {
    components: PrintComponent[];
    supplies: SupplyComponent[];
    energy_cost: number;
    wear_cost: number;
    labor_cost: number;
    profit_margin: number;
  };
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_notes?: string;
  status: OrderStatus;
  total_cost: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
  order_id?: string;
  created_at: string;
}
