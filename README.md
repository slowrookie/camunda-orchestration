Camunda orchestration 是用于学习理解如何使用标准化的流程建模语言（BPMN2.0）描述业务流程以及对业务流程进行建模，同时达到编排业务流程对应的功能实现。

## 介绍
核心概念：
* `隐性`变为`显性`
* 版本随着业务流程的变化而变化，通过流程进行沟通
* 贯穿整个软件功能开发流程，通过流程版本的迭代来影响功能的开发而不是反过来

./camunda-orchestration.01.drawio

技术方面：
1. 使用专门的流程数据系统，维护所有涉及流程流转的数据。
2. 提供流程设计工具（独立安装或集成到系统中），直接对流程进行设计。
3. 所有流程都依赖于流程引擎处理，避免硬编码的问题。
4. 通过工作流程引擎提供的API，方便的将工作流的管理和各种操作任务结合。
5. 开发不用再过度关注流程的实际参与者，活动节点、流转控制等问题，很多都直接在工作流层面已处理。

业务方面：
1. 降低开发风险，通过使用BPMN2.0的标准建模术语，使业务与开发之间的交流使用同一种语言交流成为可能。
2. 流程实现的统一，应对经常变更的业务流程，非常方便评估各种风险以及提前暴露各种问题。
3. 使业务迭代成为可能，业务流程的迭代和渐进式与开发流程直接吻合。

> 注意：工作流是对业务的抽象，单独使用没有任何意义。但不同的人对业务的不同理解会导致业务流程的设计千差万别。


## 项目

### 项目结构介绍
./backend 后端目录

./frontend 前端目录
