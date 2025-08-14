CREATE TABLE IF NOT EXISTS monthly_budgets (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  month VARCHAR(7) NOT NULL
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id VARCHAR(64) PRIMARY KEY,
  categoryId VARCHAR(64) NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  date VARCHAR(32) NOT NULL,
  description TEXT,
  budgetId VARCHAR(64) NOT NULL,
  FOREIGN KEY (budgetId) REFERENCES monthly_budgets(id)
);

-- Budget Categories table
CREATE TABLE IF NOT EXISTS budget_categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  planned DOUBLE PRECISION NOT NULL,
  actual DOUBLE PRECISION NOT NULL,
  date VARCHAR(32),
  description TEXT,
  budgetId VARCHAR(64) NOT NULL,
  FOREIGN KEY (budgetId) REFERENCES monthly_budgets(id)
);

-- Income Categories table
CREATE TABLE IF NOT EXISTS income_categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  planned DOUBLE PRECISION NOT NULL,
  actual DOUBLE PRECISION NOT NULL,
  date VARCHAR(32),
  description TEXT,
  budgetId VARCHAR(64) NOT NULL,
  FOREIGN KEY (budgetId) REFERENCES monthly_budgets(id)
);

-- Incomes table
CREATE TABLE IF NOT EXISTS incomes (
  id VARCHAR(64) PRIMARY KEY,
  categoryId VARCHAR(64) NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  date VARCHAR(32) NOT NULL,
  description TEXT,
  budgetId VARCHAR(64) NOT NULL,
  FOREIGN KEY (budgetId) REFERENCES monthly_budgets(id)
);
