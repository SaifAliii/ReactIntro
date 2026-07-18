import { useMemo, useState } from "react";
import { Layout, Menu, Grid, Drawer, Button } from "antd";
import { MenuOutlined, ThunderboltFilled } from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { lessonGroups, lessons } from "@/lessons/registry";

const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;

function useMenuItems() {
  return useMemo(
    () =>
      lessonGroups.map((group) => ({
        key: group,
        label: group,
        type: "group" as const,
        children: lessons
          .filter((l) => l.group === group)
          .map((l) => ({
            key: `/lesson/${l.slug}`,
            label: l.title,
          })),
      })),
    [],
  );
}

function Brand() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 px-4 py-4 text-[var(--color-ink)] no-underline"
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-brand)]/20 text-[var(--color-brand)]">
        <ThunderboltFilled />
      </span>
      <span className="text-[15px] font-bold leading-tight">
        React<span className="text-[var(--color-brand)]">Internals</span>
        <span className="block text-[11px] font-normal text-[var(--color-muted)]">
          & the JS Event Loop
        </span>
      </span>
    </Link>
  );
}

export default function AppShell() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const items = useMenuItems();

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={items}
      style={{ borderInlineEnd: "none", background: "transparent" }}
      onClick={({ key }) => {
        navigate(key);
        setDrawerOpen(false);
      }}
    />
  );

  return (
    <Layout className="min-h-screen !bg-transparent">
      {!isMobile && (
        <Sider
          width={272}
          theme="dark"
          className="!sticky top-0 h-screen overflow-auto border-r border-[var(--color-border)] backdrop-blur"
        >
          <Brand />
          {menu}
        </Sider>
      )}

      <Layout className="min-w-0 !bg-transparent">
        {isMobile && (
          <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)]/70 px-3 py-2 backdrop-blur">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
            />
            <Brand />
          </div>
        )}
        <Content className="min-w-0 !bg-transparent">
          <Outlet />
        </Content>
      </Layout>

      <Drawer
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={280}
        styles={{ body: { padding: 0 } }}
        title={<Brand />}
      >
        {menu}
      </Drawer>
    </Layout>
  );
}
