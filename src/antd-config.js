/**
 * Ant Design v5 Tree-shaking Configuration
 *
 * Ant Design v5 (which you are using - ^5.18.3) supports full tree-shaking
 * out of the box when imported THIS way:
 *
 *   ✅ import { Button } from 'antd';       ← your current style (CORRECT)
 *   ❌ import Button from 'antd/lib/button'; ← old style (not needed)
 *
 * In Ant Design v5, the CSS-in-JS system is used by default,
 * which means NO separate CSS file needs to be imported.
 * Each component only injects the CSS it needs.
 *
 * However, to reduce the JS bundle size further, you can wrap
 * the app with ConfigProvider to configure theming once globally
 * and avoid per-component re-initialization.
 *
 * Add this to your index.js to enable global configuration:
 *
 * import { ConfigProvider } from 'antd';
 * root.render(
 *   <ConfigProvider theme={{ token: { colorPrimary: '#F24C88' } }}>
 *     <BrowserRouter>
 *       <App />
 *     </BrowserRouter>
 *   </ConfigProvider>
 * );
 */
