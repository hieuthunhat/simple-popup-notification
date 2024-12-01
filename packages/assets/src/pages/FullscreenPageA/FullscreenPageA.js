import React, {useContext, useEffect} from 'react';
import {Card, Layout, Page, Text} from '@shopify/polaris';
import {MaxModalContext} from '@assets/contexts/maxModalContext';

/**
 * @return {JSX.Element}
 */
export default function FullscreenPageA() {
  const {openFullscreen} = useContext(MaxModalContext);

  useEffect(() => {
    openFullscreen('/settings');
  }, []);

  return (
    <Page title="Fullscreen page a">
      <Layout sectioned>
        <Card>
          <Text as="span" variant="headingSm">
            Fullscreen page a
          </Text>
        </Card>
      </Layout>
    </Page>
  );
}

FullscreenPageA.propTypes = {};
