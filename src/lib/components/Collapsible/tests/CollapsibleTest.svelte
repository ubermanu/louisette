<script>
  import Collapsible from '../index'
  const { Root, Trigger, Content } = Collapsible
</script>

<Root data-testid="collapsible" {...$$restProps}>
  <Trigger data-testid="trigger">Trigger</Trigger>
  <Content data-testid="content">
    <p>Content</p>
  </Content>
</Root>
