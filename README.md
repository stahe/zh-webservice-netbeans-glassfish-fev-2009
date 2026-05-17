# 使用 NetBeans 6.5 和 GlassFish 创建 Java EE Web 服务

👉 **相关教程：**
[使用 NetBeans 6.5 IDE 和 GlassFish Java EE 服务器创建 Java EE Web 服务](https://stahe.github.io/zh-webservice-netbeans-glassfish-fev-2009/)

---

## 📌 本教程的目标

本教程将介绍使用以下工具**创建并部署 Java EE (J2EE) Web 服务**所需的步骤：

* **NetBeans 6.5** 集成开发环境 (IDE)
* 集成应用服务器 **GlassFish**

此外，本教程还将展示如何开发和测试使用该 Web 服务的 **不同类型的客户端**：
* Java 客户端
* C# 客户端
* ASP.NET 客户端
* Flex 客户端

本教程不会逐行讲解代码。因此，本文档面向已具备以下方面一定经验的开发人员：
* Java EE
* EJB 3
* JPA
* NetBeans

---

## 🛠️ 使用的环境与工具

### 数据库

* **MySQL 5**
  [http://www.mysql.com/](http://www.mysql.com/)

### Java IDE

* **NetBeans 6.5**
  [http://www.netbeans.org/](http://www.netbeans.org/)

### Microsoft IDE

* **Visual Studio Express 2008 SP1** (C# 和 Web)
  [http://www.microsoft.com/Express/](http://www.microsoft.com/Express/)

### Flex 开发

* **Adobe Flex Builder 3**
  [https://www.adobe.com/](https://www.adobe.com/)

* **Adobe Flash Player**
  [http://www.adobe.com/fr/products/flashplayer/](http://www.adobe.com/fr/products/flashplayer/)
  
  
### Web 服务器
  
  * **Apache（通过 WampServer）**
  [http://www.wampserver.com/](http://www.wampserver.com/)

---

## 🏗️ 课程内容

本教程主要涵盖：

* Java EE Web 服务的设计
* 在 GlassFish 服务器上的部署
* 通过 JPA 访问数据
* 在不同技术环境中使用 Web 服务：
  * Java SE
  * .NET (C#, ASP.NET)
  * Flex
本教程假设您已了解所用基础概念（EJB3、JPA、Java EE 架构），或已通过教程中提及的补充资源学习过这些内容。

---

## 🎯 目标受众

本文档主要面向：

* 学习 Java EE 开发的学员
* 希望了解 Java EE 与 .NET 互操作性的开发人员
* 任何希望在传统 Java EE 环境中实现 SOAP Web 服务的人士

---

## 📎 注释

* 本教程侧重于**实际实现**，而非对代码的详尽解释。
* 教程基于 2000 年代末的技术环境（NetBeans 6.5、GlassFish、Flex）。

Serge Tahé，2009 年 2 月
