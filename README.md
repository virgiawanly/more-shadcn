# More Shadcn Components

A collection of custom [shadcn/ui](https://ui.shadcn.com) components that extend the official component library with additional functionality and features.

## Available Components

- **AsyncSelect** - A select component that fetches options asynchronously

## Usage

You can add components directly to your project using the shadcn CLI:

```bash
npx shadcn add https://github.com/virgiawanly/more-shadcn/raw/main/public/r/async-select.json
```

Replace `async-select` with the component name you want to install.

## Development

This project is built with:

- [Next.js](https://nextjs.org) - React framework
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [TypeScript](https://typescriptlang.org) - Type safety

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/virgiawanly/more-shadcn.git
   cd more-shadcn
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the documentation.

### Building the Registry

To build the component registry:

```bash
pnpm registry:build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
