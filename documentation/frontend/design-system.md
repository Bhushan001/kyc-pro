# Design System

## 📋 System Overview

**Design System Name**: KYC-Pro Design System  
**Framework**: React TypeScript (Reference Implementation)  
**Styling**: Tailwind CSS  
**Component Library**: shadcn/ui  
**Icons**: Lucide React  
**Theming**: Light/Dark Mode Support

## 🎯 Purpose & Functionality

The KYC-Pro Design System provides a **unified visual foundation** for all frontend applications in the platform. It ensures consistency, accessibility, and maintainability across all user interfaces while supporting the diverse needs of different user roles and use cases.

### Key Responsibilities:
- **Visual Consistency**: Unified design language across all portals
- **Component Reusability**: Shared components and patterns
- **Accessibility**: WCAG compliant design standards
- **Responsive Design**: Mobile-first responsive approach
- **Theme Management**: Light and dark mode support
- **Design Tokens**: Centralized design variables
- **Documentation**: Comprehensive component documentation

## ⚙️ Configuration Details

### Design Tokens
```css
:root {
  /* Colors */
  --primary: #030213;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --card: #ffffff;
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --secondary-foreground: #030213;
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --accent-foreground: #030213;
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.1);
  --input: transparent;
  --input-background: #f3f3f5;
  --ring: oklch(0.708 0 0);
  
  /* Typography */
  --font-size: 14px;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  
  /* Spacing */
  --radius: 0.625rem;
  
  /* Charts */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}
```

### Dark Mode Tokens
```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
}
```

## 🏗️ Component Architecture

### Core Components
```
design/components/
├── ui/                    # Base UI components
│   ├── button.tsx        # Button variants
│   ├── card.tsx          # Card containers
│   ├── input.tsx         # Form inputs
│   ├── dialog.tsx        # Modal dialogs
│   ├── table.tsx         # Data tables
│   ├── chart.tsx         # Data visualization
│   └── ...               # 45+ UI components
├── dashboards/           # Dashboard components
│   ├── Hub.tsx           # Platform admin dashboard
│   ├── Console.tsx       # Tenant admin dashboard
│   └── Workspace.tsx     # User workspace dashboard
├── AuthPage.tsx          # Authentication pages
├── LandingPage.tsx       # Landing page
└── ...                   # Other page components
```

### Component Categories

#### Form Components
- **Button**: Primary, secondary, destructive variants
- **Input**: Text, email, password, search inputs
- **Select**: Dropdown selections
- **Checkbox**: Boolean inputs
- **Radio**: Single choice inputs
- **Textarea**: Multi-line text inputs
- **Form**: Form validation and handling

#### Layout Components
- **Card**: Content containers with headers
- **Dialog**: Modal dialogs and overlays
- **Sheet**: Side panels and drawers
- **Accordion**: Collapsible content sections
- **Tabs**: Tabbed interfaces
- **Navigation**: Menu and navigation components

#### Data Components
- **Table**: Sortable and filterable data tables
- **Chart**: Data visualization components
- **Badge**: Status indicators
- **Progress**: Progress indicators
- **Pagination**: Page navigation
- **Calendar**: Date selection

#### Feedback Components
- **Alert**: Status messages and notifications
- **Toast**: Temporary notifications
- **Skeleton**: Loading states
- **Tooltip**: Contextual information
- **Popover**: Floating content panels

## 🎨 Design Principles

### Visual Hierarchy
- **Typography Scale**: Consistent font sizes and weights
- **Color System**: Semantic color usage
- **Spacing Scale**: Consistent spacing values
- **Component Sizing**: Standardized component dimensions

### Accessibility
- **WCAG Compliance**: AA level accessibility standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Clear focus indicators

### Responsive Design
- **Mobile-First**: Design for mobile devices first
- **Breakpoint System**: Consistent responsive breakpoints
- **Touch-Friendly**: Optimized for touch interactions
- **Performance**: Optimized for mobile networks

## 🔧 Implementation Guidelines

### Component Usage
```typescript
// Button Component
import { Button } from './ui/button';

<Button variant="default" size="lg">
  Primary Action
</Button>

<Button variant="outline" size="sm">
  Secondary Action
</Button>

<Button variant="destructive">
  Delete
</Button>
```

### Styling Approach
```css
/* Utility-First with Tailwind */
.button-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

.button-secondary {
  @apply border bg-background text-foreground hover:bg-accent;
}

/* Custom CSS when needed */
.custom-component {
  @apply flex items-center gap-2 p-4 rounded-lg border;
}
```

### Theme Integration
```typescript
// Theme Provider
import { ThemeProvider } from './theme-provider';

<ThemeProvider defaultTheme="light" storageKey="ui-theme">
  <App />
</ThemeProvider>
```

## 📱 Responsive Design

### Breakpoint System
```css
/* Mobile First */
.container {
  @apply px-4 py-2; /* Mobile */
}

@media (min-width: 768px) {
  .container {
    @apply px-6 py-4; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .container {
    @apply px-8 py-6; /* Desktop */
  }
}
```

### Component Responsiveness
- **Mobile**: Stacked layouts, touch-friendly interactions
- **Tablet**: Side-by-side layouts, hover states
- **Desktop**: Multi-column layouts, advanced interactions

## 🎯 Role-Specific Design

### Platform Admin (Hub Portal)
- **Data Density**: Efficient use of screen space
- **Quick Actions**: Easy access to administrative tasks
- **Analytics Focus**: Charts and data visualization
- **Professional Interface**: Clean, corporate design

### Tenant Admin (Console Portal)
- **Organization Focus**: Tenant-specific branding
- **User Management**: Efficient user workflows
- **Billing Integration**: Payment and subscription features
- **Compliance Tools**: Regulatory compliance features

### End User (Workspace Portal)
- **Productivity Focus**: Task management and workflows
- **Collaboration**: Team communication features
- **Module Access**: Business module interfaces
- **Personalization**: User preferences and customization

## 🔄 Integration with Angular

### Angular Implementation
```typescript
// Angular Component with Design System
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container mx-auto p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">Dashboard</h2>
          <button class="btn btn-primary">Action</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Component logic
}
```

### CSS Classes
```css
/* Design System Classes */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

.card {
  @apply bg-card text-card-foreground rounded-lg border shadow-sm;
}
```

## 🧪 Testing & Quality

### Component Testing
```typescript
// Component Test
describe('Button Component', () => {
  it('should render with correct variant', () => {
    const button = render(<Button variant="primary">Click me</Button>);
    expect(button).toHaveClass('bg-primary');
  });
});
```

### Accessibility Testing
- **Automated Testing**: axe-core integration
- **Manual Testing**: Keyboard navigation and screen readers
- **Color Contrast**: Automated contrast checking
- **Focus Management**: Focus trap and indicator testing

## 📚 Documentation

### Component Documentation
Each component includes:
- **Usage Examples**: Code examples and demos
- **Props Interface**: TypeScript interfaces
- **Accessibility Notes**: ARIA and keyboard support
- **Design Guidelines**: Visual and interaction guidelines

### Design Tokens
- **Color Palette**: Primary, secondary, semantic colors
- **Typography**: Font families, sizes, weights
- **Spacing**: Margin, padding, gap values
- **Shadows**: Elevation and depth system

## 🔄 Version Control

### Design System Updates
- **Semantic Versioning**: Major.minor.patch releases
- **Change Log**: Documented breaking changes
- **Migration Guide**: Upgrade instructions
- **Deprecation Policy**: Component lifecycle management

## 📚 Related Documentation

- [KYC-Pro Portal](./kyc-pro-portal.md) - Landing portal implementation
- [Hub Portal](./hub-portal.md) - Platform admin interface
- [Console Portal](./console-portal.md) - Tenant admin interface
- [Workspace Portal](./workspace-portal.md) - User workspace interface
- [shadcn/ui Documentation](https://ui.shadcn.com/) - Component library reference

---

*Last Updated: [Current Date]*  
*Design System Version: 1.0.0* 