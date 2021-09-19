import React from 'react'
import { createStructuredSelector } from 'reselect'
import { connect, ConnectedProps } from 'react-redux'
import {
    isRepoListEmptySelector,
    selectedRepoUrlSelector
} from '../../redux/repositories/repositories.selector'
import style from './selected-repo-pr-analytics.module.scss'

export interface SelectedRepoPrAnalyticsComponentProps
    extends SelectedRepoPrAnalyticsComponentPropsFromRedux {
}

function SelectedRepoPrAnalyticsComponent({
    selectedRepoUrl,
    isRepoListEmpty
}: SelectedRepoPrAnalyticsComponentProps) {

    return (
        <div className={ style.container }>
            <div className={ style.pr_analytics_container }>
                TODO: Add a chart and a table
            </div>
        </div>
    )
}

const mapStateToProps = createStructuredSelector({
    selectedRepoUrl: selectedRepoUrlSelector,
    isRepoListEmpty: isRepoListEmptySelector,
})


const connector = connect(mapStateToProps)

export type SelectedRepoPrAnalyticsComponentPropsFromRedux = ConnectedProps<typeof connector>

export default connector(SelectedRepoPrAnalyticsComponent)
