import React, {useState} from 'react';
import {BlockStack, Button, Card, InlineStack, Layout, Page, Text} from '@shopify/polaris';
// import {MaxModalContext} from '@assets/contexts/maxModalContext';

/**
 * Render a home page for overview
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function Home() {
  const [enabled, setEnabled] = useState(false);
  // const {openFullscreen} = useContext(MaxModalContext);

  return (
    <Page title="Home">
      <Layout>
        <Layout.Section>
          <BlockStack>
            <Card>
              <InlineStack blockAlign="center">
                <Text as="span">Our app is {enabled ? 'enabled' : 'disabled'} on your store</Text>
                <div style={{flex: 1}} />
                <Button
                  variant={enabled ? 'secondary' : 'primary'}
                  onClick={() => setEnabled(prev => !prev)}
                >
                  {enabled ? 'Disable' : 'Enable'}
                </Button>
              </InlineStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
