import PropTypes from 'prop-types'
import React from 'react'
import Ink from 'react-ink'
import schema from 'part:@sanity/base/schema'
import {StateLink} from 'part:@sanity/base/router'
import WarningIcon from 'part:@sanity/base/warning-icon'
import {Item as GridListItem} from 'part:@sanity/components/lists/grid'
import {PreviewSubscriber, SanityDefaultPreview} from 'part:@sanity/base/preview'
import listStyles from './styles/ListView.css'
import styles from './styles/PaneItem.css'

const getUnknownTypeFallback = (id, typeName) => ({
  title: <span style={{fontStyle: 'italic'}}>No schema found for type &quot;{typeName}&quot;</span>,
  subtitle: <span style={{fontStyle: 'italic'}}>Document: {id}</span>,
  media: WarningIcon
})

const getMissingDocumentFallback = value => ({
  title: <span style={{fontStyle: 'italic'}}>{value.title || 'Missing document'}</span>,
  subtitle: (
    <span style={{fontStyle: 'italic'}}>
      {value.title ? `Missing document ID: ${value._id}` : `Document ID: ${value._id}`}
    </span>
  ),
  media: WarningIcon
})

// eslint-disable-next-line complexity
export default function PaneItem(props) {
  const {id, getLinkState, isSelected, schemaType, layout, status, icon, value} = props
  const useGrid = layout === 'card' || layout === 'media'
  const hasSchemaType = schemaType && schemaType.name && schema.get(schemaType.name)
  const schemaIcon = hasSchemaType && schemaType.icon

  let content
  if (hasSchemaType && value && value._id) {
    content = (
      <PreviewSubscriber type={schemaType} value={value} key={value._id}>
        {res => {
          const {snapshot, isLoading} = res
          const missing = !(isLoading || snapshot)

          return (
            <SanityDefaultPreview
              key={value._id}
              icon={icon || schemaIcon}
              isPlaceholder={isLoading}
              status={status}
              layout={layout}
              value={missing ? getMissingDocumentFallback(value) : snapshot}
            />
          )
        }}
      </PreviewSubscriber>
    )
  } else if (value._id && !hasSchemaType) {
    content = (
      <SanityDefaultPreview
        value={getUnknownTypeFallback(value._id, value._type)}
        icon={icon || schemaIcon}
        layout={layout}
        status={status}
      />
    )
  } else {
    content = (
      <SanityDefaultPreview
        value={value}
        layout={layout}
        icon={icon || schemaIcon}
        status={status}
      />
    )
  }

  const link = (
    <StateLink state={getLinkState(id)} className={styles.link}>
      {content}
      <Ink duration={1000} opacity={0.1} radius={200} />
    </StateLink>
  )

  return useGrid ? (
    <GridListItem className={listStyles[`${layout}ListItem`]}>{link}</GridListItem>
  ) : (
    <div className={isSelected ? styles.selected : styles.item}>{link}</div>
  )
}

PaneItem.propTypes = {
  id: PropTypes.string.isRequired,
  getLinkState: PropTypes.func.isRequired,
  layout: PropTypes.string,
  isSelected: PropTypes.bool,
  status: PropTypes.func,
  icon: PropTypes.func,
  value: PropTypes.shape({
    _id: PropTypes.string,
    _type: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    media: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
  }),
  schemaType: PropTypes.shape({
    name: PropTypes.string,
    icon: PropTypes.func
  })
}

PaneItem.defaultProps = {
  layout: 'default',
  value: null,
  status: undefined,
  isSelected: false,
  schemaType: null
}
